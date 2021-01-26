### Scope:
API Operations:
  - list - `GET /application-flagged-sets`
  - resolve - `POST /application-flagged-sets/:id/resolve`
Side effects:
  - creation logic will start in ApplicationFlaggedSetService (on `afterInsert` and `afterUpdate` events of Application entity)
  - duplicate application removal will happen in `resolve` API operation
    - [NB] when to update the application's status and what?
    - [NB] I am assuming ApplicationFlaggedSet status will be updated in `resolve`
    - [NB] no soft delete happens on resolved applications, instead introduce the new status for application (resolved/dupliacte)
Some additional requirements:
  - permissions: only an admin or a leasingAgent can access resources in this endpoint
      
Notes:
 - FLAGS tab existence should be determined with a separate API call `/GET /application-flagged-sets/?listingId=id` - I'm assuming that a leasing agent is browsing applications for a specific list, one listing at a time, so the table he sees is only for that listing
    - [NB] Does it mean AFS entity model should have a column to store listingId?
 - ApplicationFlaggedSet abbreviation -> AFS
 
Questions:
  - Kathy wrote:
```And the application will be checked removed from all other duplicate groupings that the application appears in ``` https://github.com/bloom-housing/bloom/issues/903
  I don't think it's intuitive and actually valid: what if I resolve a duplicate set with Name rule and there is another one with residence which is also a valid duplicate group? 
      - [NB] I think it is half valid. if the application is part of 3 flagged set and we resolve application in one flagged set say Name+DOB what will be the status of that application? will the status of the application is removed? if so how will the same application appear in the rest of the two flagged set?
      - [NB] And if we remove the application from 
  - Should we be able to UNDO a resolution?
  - [NB] Also there is statement in #903
  ```Once a user checks a duplicate and clicks Resolve the label will appear as Resolved no matter if they clicked one or multiple applications, it's that they took an action```
  - If there are 3 applications in a flaaged set and resolver clicks only one application to resolve instead of 2 applications, now there are 2 applications left in flagged set insates of 1 and the status is resolved. Which application should be considered as valid/active?
  
### Plan 

1. Let's start with DB models. Define an AFS entity:
    - props:
      - id, createdAt, updatedAt
      - name: string.   
            ```What value does the name holds??```
      - rule: Enum
      - resolved: boolean (default = false)
      - resolvedTime: Date (nullable = true)
      - resolvingUserId: User (nullable = true, eager = true)
      - resolved application: Application (nullable = true)  
        ```Is it the list of application ids that are resolved?```
      - status: Enum (Values: flagged, resolved)
      - applications: Application[]
      
      - [NB] Do we need listingID prop as well? - No required
    - define owning relation to be AFS with @JoinTable() decorator
    - generate a migration

2. Now create a data transfer object for AFS (AFS Dto) - no need for Update and Create variants now since we won't create or update them using the HTTP API
    - use Omit NestJS mapped type and make sure to use ApplicationDto[] and UserDto types for applications and user properties

3. In order to expose HTTP route `GET /application-flagged-sets` create a new Controller in src/applications and name it e.g. `application-flagged-set.controller.ts`
  - [NB] Why can't the AFS controller be on src/AFS/? we are having Entity and DTO in src/AFS
    - set the controller route to `/application-flagged-sets`
    - annotate the controller with `@ApiTags("applicationFlaggedSets")` and `@ApiBearerAuth()` so that swagger models are generated
    - add an empty `GET /application-flagged-sets` route handler to it  (return an empty array or sth)
    - annotate the new endpoint with `@ApiOperation`
    - add a validation pipe the same way it is added in other controllers
    - check if this new controller returns an empty array under `GET /application-flagged-sets` and whether `/docs` page contains a new tab for AFS

4. Add a new service for business logic encapsulation and name it e.g. `application-flagged-set.service.ts`
    - remember to annotate the new service with `@Injectable()` decorator and add it to `applications.module.ts` as a provider
    - add a list method to it, retrieve a list of all flagged sets using a Repository<ApplicationFlaggedSet>.find method (see how repositories are injected using constructor in other services, that should probably also require adding AFS entity class to `applications.module.ts` TypeORM's forFeature method)
    - add an AFS Service through a constructor to AFS Controller and use it in `GET /application-flagged-sets`
    - make sure to used mapTo to transform AFS entity array into AFS Dto
    - validate that the new endpoint is available under `GET /application-flagged-sets` and it returns an empty array

5. Our new endpoint is available for *everyone*, it's time to secure it:
    - go to src/auth/authz_policy.csv and add a new line 'p, admin, applicationFlaggedSet, true, .*' -  it will allow an admin to perform everything on applicationFlaggedType resource
    - add:
        ```
        @ResourceType("applicationFlaggedSet")
        @UseGuards(AuthzGuard)
        ```
    decorators to AFS Controller -> now Casbin module knows which resource is an 'applicationFlaggedSet' and will search for policies with such subject when someone accesses any endpoint through this controller
    - check if an unauthenticated user is denied access to `GET /application-flagged-set` with 403 Forbidden
    - check if an admin can list this resource

6. Create hooks for `afterInsert` and `afterUpdate` events of Application entity - it's where we want to put duplicate flagging logic. Use `@EventSubscriber` from TypeORM https://github.com/typeorm/typeorm/blob/master/docs/listeners-and-subscribers.md#what-is-a-subscriber to apply a hook on afterInsert and afterUpdate for Application entity. I think the best place to implement it at the moment is AFS Service, so make AFS service implement this EventSubscriber interface as in the TypeORM documentation.
    - implement afterInsert -> simply create a new  mock AFS instance with no applications associated with it and save it using the AFS repository, but set e.g. a name (for test purposes now)
        - [NB] Did not quote understand what `afterInsert` and `afterUpdate` do
        - [NB] to create a mock AFS we should first write the logic to pull the duplicate applications from application entity is it? Should we use aggregator to pull the duplicate entries and group them and then feed that to AFS entity?
        - [NB] business logic to be written in the AFS controller using afterInsert hook
    - check if `GET /application-flagged-sets` returns a non empty array after an application has been submitted
  
    To summarize we should now have a new AFS Controller which only allows an admin to list dummy application flagged sets

7. Create new endpoint `POST /application-flagged-set/:id/resolve`
    - Create a new AFS Resolve DTO which takes an array of ids as an input (those will be applications marked as duplicated)
    - add a new resolve method to AFS Controller and a corresponding resolve method to AFS Service, simply set 'resolved' to true for a given AFS id for now (mock implementation)
    - test if we can e.g. update "resolved" property with this endpoint 
    - we can implement a proper resolution logic now or later -> if now then we need to soft delete Applications marked as duplicated by the user (those in the input array). Use Application service (inject it using a constructor) in resolve method of AFS service to soft delete applications, set resolve to true, resolvingUserId to the one associated with the HTTP request and resolvedTime to current timestamp

8. Implement duplicate flagging logic:
    - in AFS Service afterInsert/afterUpdate hook create a method that will consume an Application instance and act on it (make sure we are only flagging duplicates in a specific listing scope)
    - TBD

### TODO: 
    - Extend AFS Controller.list to accept listingId as a query param
    - Add object level permissions and allow a leasing agent to access AFS (now the permissions only allow admins to act on AFS) - see ApplicationsController.authorizeUserAction method and how it's implemented along with AuthzService implementation, basically we can only tell whether a leasingAgent is allowed to do something after we retrieve the object from the database and check if this is an AFS for a listing that this leasingAgent is assigned to. 

## Revision [MP]:
### Duplicate adding logic:

1. Application inserted (either caputed by afterInsert or directly in ApplicationsService)
2. Make 3 queries::
	a. find all existing applications that match rule 1 name + dob for given new application
	b. find all existing applications that match rule 2 residence address for given new application
	c. find all existing applications that match rule 3 email for given new application
3. For each of the 3 groups of ex_applications (existing applications):

```python
new_application = {}
query_results = {
  "name_dob": [],
  "residence": []
  "email": [] 
}
for group_rule, group in query_results.items():
	for ex_application in a group:
		for afses in ex_application.application_flagged_sets:
			if any([afs.rule == group_rule for afs in afses):
				if new_application in afs.applications:
          continue
        else:
          afs.add(new_application)
          afs.save()
			else:
				create a new AFS and connect e_application with new_application
        afs.save()
```

### Resolving logic:

By resolving I mean marking as duplicate:

1. Input is:
  - AFS id
  - applications ids array to be resolved

2. Since we need to mark multiple applications here I think we need another M:N relation with applications something like resolved applications. Assuming that AFS now has a new property resolvedApplications (array of resolved applications):
  - add applications ids to this AFS.resolvedApplications array
  - mark AFS.resolved to true (action has been taken)
  - set resolvingUserId
  - set resolve time

3. Now we need to remove the resolved applications from other AFSes. Fetch applications given in input applications ids array and:
```python
input_afs_id = ''
applications_with_afs_joined = []
for application in applications_with_afs_joined:
  afs_array_without_resolved_one = filter(lambda afs: afs.id != input_afs_id, application.afs)
  for afs in afs_array_without_resolved_one:
    afs.remove(application.id)
```

### Querying applications:

Logic of querying applications should be modified to accomodate: 

> And the application will then be removed from the main applications table

So if we added the application to AFS.resolvedApplications we need to somehow filter out applications that are in AFS.resolvedApplications because this is indicator that application is a duplicate.

```python
all_applications = []
map_to_id_array = lambda arr: map(lambda item: item.id, arr)
filter(lambda app: not any([app.id in map_to_id_array(afs.resolved_applications)] for afs in app.application_flagged_sets), all_applications)
# In other words allow only that do not appear in any resolved_applications array for any afs their are assigned to
```

NOTE: I think application should have a separate property 'duplicate' which is not in the DB but dynamically computed from AFS table like this:

```typescript
  class Application {
    ...
    @Expose()
    @ApiProperty()
    get isDuplicate(): boolean {
      return this.applicationFlaggedSets.some(afs => this.id in afs.resolvedApplications)
    }
    ...
  }
```

