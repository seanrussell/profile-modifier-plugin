# profile-additions

A plugin for Salesforce DX CLI that provides ability to add Apex Classes, Visualforce Pages, Objects, and Fields to profiles.

## Setup

### **Install as plugin (Recommended approach for Installing)**

Install plugin using command : `sfdx plugins:install profile-additions`

### **Commands**

- [`sfdx profile:add:class`](#sfdx-profileaddclass)
- [`sfdx profile:delete:class`](#sfdx-deleteclass)
- [`sfdx profile:edit:class`](#sfdx-editclass)
- [`sfdx profile:add:field`](#sfdx-addfield)
- [`sfdx profile:delete:field`](#sfdx-deletefield)
- [`sfdx profile:edit:field`](#sfdx-editfield)
- [`sfdx profile:add:object`](#sfdx-addobject)
- [`sfdx profile:delete:object`](#sfdx-deleteobject)
- [`sfdx profile:edit:object`](#sfdx-editobject)
- [`sfdx profile:add:page`](#sfdx-addpage)
- [`sfdx profile:delete:page`](#sfdx-deletepage)
- [`sfdx profile:edit:page`](#sfdx-editpage)

## `sfdx profile:add:class`

Adds Apex class to profiles.

```
USAGE
  $ sfdx profile:add:class

OPTIONS
  -n, --name=classname                  (required) the name of the Apex Class you want to add.

  -p, --profile=profilename             the name of the profile you want to add the class to. This can be a comma separated list of profile names. Note: if a profile name has a space in the name, the name should be enclosed in quotes. If this flag is not specified, the assumption is that the class will be added to all profiles in either the default location or the location provided by in the --filepath option.

  -e, --enabled                         [default: false] Enable Apex Class

  -f, --filepath=filepath               [default: force-app/main/default/profiles] filepath to the location of the profiles

  -u, --username=username               the username or alias of the Salesforce org you want to deploy the profiles to. Note: The Apex Class must already exist in the Salesforce org prior to deploying the profile or the command will fail.


EXAMPLES
    $ sfdx profile:class:add --name MyClass --profile "Admin" --enabled
    $ sfdx profile:class:add --name MyClass --enabled // Adds MyClass to all profiles
    $ sfdx profile:class:add --name MyClass --profile "Admin" --enabled --username <test@test.com> // Adds MyClass to Admin profile and deploys profile to org with username test@test.com
```

_See code: [src/commands/profile/class/add.ts](https://github.com/seanrussell/profile-plugin/blob/main/src/commands/profile/class/add.ts)_

## `sfdx profile:delete:class`

Removes Apex class from profiles.

```
USAGE
  $ sfdx profile:delete:class

OPTIONS
  -n, --name=classname                  (required) the name of the Apex Class you want to add.

  -p, --profile=profilename             the name of the profile you want to remove the class from. This can be a comma separated list of profile names. Note: if a profile name has a space in the name, the name should be enclosed in quotes. If this flag is not specified, the assumption is that the class will be removed from all profiles in either the default location or the location provided by in the --filepath option.

  -f, --filepath=filepath               [default: force-app/main/default/profiles] filepath to the location of the profiles

  -u, --username=username               the username or alias of the Salesforce org you want to deploy the profiles to. Note: The command does actually remove the class from the Salesforce org.


EXAMPLES
    $ sfdx profile:delete:add --name MyClass --profile "Admin" --enabled
    $ sfdx profile:delete:add --name MyClass // Removes MyClass from all profiles
    $ sfdx profile:delete:add --name MyClass --profile "Admin" --enabled --username <test@test.com> // Removes MyClass from Admin profile and deploys profile to org with username test@test.com
```

_See code: [src/commands/profile/class/delete.ts](https://github.com/seanrussell/profile-plugin/blob/main/src/commands/profile/class/delete.ts)_
