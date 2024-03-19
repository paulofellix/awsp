# AWSP2 - Upgraded AWS Profile Switcher

Easily switch between AWS Profiles.

Expanded fork of [awsp by johnnyopao](https://github.com/johnnyopao/awsp) with additional features and ongoing maintenance.*

\* no guarantee expressed or implied.

<img src="demo.gif" width="500">

## How it works

The AWS CLI will use the default profile present in the `$HOME/.aws/credentials`, if no flag is set. This script parses the current aws profiles (`~/.aws/config`) and provides a filterable list, and then sets default profile to the selected one.

## Prerequisites
Set up any number of profiles using the aws cli.

```sh
aws configure --profile PROFILE_NAME
```

You can also leave out the `--profile PROFILE_NAME` param to set your `default` credentials

Refer to the AWS CLI Documentation for more information:
https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html


## Usage
Standard usage is just to call `awsp` and select a profile:
```sh
awsp
```
You can type to filter the list, or arrow through the shown options. Press \<Enter\> to select the highlighted option.

You can also type a profile with the command to immediately switch:
```sh
awsp development
```

## Contributing
Issues and pull requests are welcome. 😄

## License
This project and the original work are licensed under the [ISC License](LICENSE.md).

Copyright (c) 2021 Abyss

Original Work Copyright (c) 2020 Johnny Opao (@ https://github.com/johnnyopao/awsp)
