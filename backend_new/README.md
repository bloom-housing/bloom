# Setup
## Installation
Make sure the .env file's db placement is what works for your set up, Then run the following:

```bash
$ yarn install
$ yarn db:setup
```


# Modifying the Schema

We use [Prisma](https://www.prisma.io/) as the ORM. To modify the schema you will need to work with the <b>schema.prisma</b> file. This file controls the following:
<ol>
  <li> The Structure of each model (entity if you are more familiar with TypeORM) </li>
  <li> The Relationships between models </li>
  <li> Enum creation for use in both the API and the database </li>
  <li> How Prisma connects to the database </li>
</ol>

## Conventions
We use the following conventions:
<ul>
  <li> model and enum names are capitalized camelcased (e.g. HelloWorld) </li>
  <li> model and enum names are <b>@@map()</b>ed to lowercase snakecased (e.g. hello_world) </li>
  <li> a model's fields are lowercase camelcased (e.g. helloWorld) </li>
  <li> a model's fields are <b>@map()</b>ed to lowercase snackcased (e.g. hello_world) </li>
</ul>
This is to make the api easier to work with, and to respect postgres's name space conventions
