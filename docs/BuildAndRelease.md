# Checklist for Publishing shared packages to NPM.

0. Make sure your git workspace is on the master branch, pulled with the latest, and there are no extraneous files.

1. Manually update the monorepo root package version to match the expected new version number and do a git commit of that single change.

   - commiting directly to master is ok in this one case.
   - unfortunately lerna doesn't have a good way to do this automatically at the moment, but maybe it's a config problem?

2. `lerna publish`

3. Check to make sure that Heroku and Netlify deploys haven't failed because they won the race condition between NPM publishing and auto-deploy of the new master push.

   - Suggestions welcomed for how to improve the tooling around this problem.

4. Verify that the reference web sites are still working correctly after the new build is deployed.

   - The build should functionally be a no-op so the chance of a problem should be low, but it's important to check for anything unexpected.
