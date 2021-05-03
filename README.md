# profile-additions

A plugin for Salesforce DX CLI that provides ability to add Apex Classes, Visualforce Pages, Objects, and Fields to profiles.

## Setup

### **Install as plugin (Recommended approach for Installing)**

Install plugin using command : `sfdx plugins:install profile-additions`

### **Commands**

- [`sfdx profile:add:class`](#sfdx-profileaddclass)
- [`sfdx profile:delete:class`](#sfdx-profiledeleteclass)
- [`sfdx profile:edit:class`](#sfdx-profileeditclass)
- [`sfdx profile:add:field`](#sfdx-profileaddfield)
- [`sfdx profile:delete:field`](#sfdx-profiledeletefield)
- [`sfdx profile:edit:field`](#sfdx-profileeditfield)
- [`sfdx profile:add:object`](#sfdx-profileaddobject)
- [`sfdx profile:delete:object`](#sfdx-profiledeleteobject)
- [`sfdx profile:edit:object`](#sfdx-profileeditobject)
- [`sfdx profile:add:page`](#sfdx-profileaddpage)
- [`sfdx profile:delete:page`](#sfdx-profiledeletepage)
- [`sfdx profile:edit:page`](#sfdx-profileeditpage)

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
    $ sfdx profile:class:delete --name MyClass --profile "Admin" --enabled
    $ sfdx profile:class:delete --name MyClass // Removes MyClass from all profiles
    $ sfdx profile:class:delete --name MyClass --profile "Admin" --enabled --username <test@test.com> // Removes MyClass from Admin profile and deploys profile to org with username test@test.com
```

_See code: [src/commands/profile/class/delete.ts](https://github.com/seanrussell/profile-plugin/blob/main/src/commands/profile/class/delete.ts)_

## `sfdx profile:edit:class`

Edits an Apex class in profiles.

```
USAGE
  $ sfdx profile:edit:class

OPTIONS
  -n, --name=classname                  (required) the name of the Apex Class you want to edit. Only one Apex Class name is allowed.

  -r --rename=renameclassname           the name of the Apex Class you want to rename the class specified in --name to

  -p, --profile=profilename             the name of the profile you want to remove the class from. This can be a comma separated list of profile names. Note: if a profile name has a space in the name, the name should be enclosed in quotes. If this flag is not specified, the assumption is that the class will be edited in all profiles in either the default location or the location provided by in the --filepath option.

  -e, --enabled                         [default: false] Enable Apex Class

  -f, --filepath=filepath               [default: force-app/main/default/profiles] filepath to the location of the profiles

  -u, --username=username               the username or alias of the Salesforce org you want to deploy the profiles to. Note: The command does actually remove the class from the Salesforce org.


EXAMPLES
    $ sfdx profile:class:edit --name MyClass --rename YourClass --profile "Admin" --enabled',
    $ sfdx profile:class:edit --name MyClass --rename YourClass --enabled // Edits MyClass in all profiles
    $ sfdx profile:class:edit --name MyClass --rename YourClass --profile "Admin" --enabled --username <test@test.com> // Edits MyClass in Admin profile and deploys profile to org with username test@test.com
```

_See code: [src/commands/profile/class/edit.ts](https://github.com/seanrussell/profile-plugin/blob/main/src/commands/profile/class/edit.ts)_
