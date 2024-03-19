import fs from 'node:fs';
import inquirer from 'inquirer';
import ini from 'ini';
import { createInterface } from 'node:readline';

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

let awsConfig: {
  [key: string]: {
    region: string;
    endpoint_url?: string;
    [key: string]: string | undefined;
  };
};
let awsCredentials: {
  [key: string]: {
    aws_access_key_id: string;
    aws_secret_access_key: string;
  };
};
let awsProfiles: string[];

const readAwsConfigAndCredentials = () => {
  awsConfig = ini.parse(
    fs.readFileSync(`${process.env.HOME}/.aws/config`, 'utf-8')
  );
  awsCredentials = ini.parse(
    fs.readFileSync(`${process.env.HOME}/.aws/credentials`, 'utf-8')
  );
  awsProfiles = Object.keys(awsConfig)
    .sort()
    .filter(profile => profile.startsWith('profile '))
    .map(profile => profile.replace('profile ', ''));
};

const ask = () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    question: (question: string) => {
      return new Promise<string>(resolve => {
        rl.question(question, (answer: string) => {
          rl.close();
          resolve(answer);
        });
      });
    },
  };
};

const createAwsProfile = async (
  awsAccessKeyId: string,
  awsSecretAccessKey: string
) => {
  console.log('Default profile credentials not found in any profile');
  console.log('Creating new profile for default credentials');
  const profileName = await ask().question('Enter profile name: ');
  const region = await ask().question('Enter region: ');

  awsCredentials[profileName] = {
    aws_access_key_id: awsAccessKeyId,
    aws_secret_access_key: awsSecretAccessKey,
  };

  awsConfig[`profile ${profileName}`] = {
    region,
  };

  writeAwsConfigAndCredentials();

  console.log(`Created profile: ${profileName}`);
};

const checkDefaultProfile = async () => {
  const awsDefaultProfile = awsCredentials.default;
  if (!awsDefaultProfile) {
    return;
  }

  const awsAccessKeyId = awsDefaultProfile.aws_access_key_id;
  const awsSecretAccessKey = awsDefaultProfile.aws_secret_access_key;

  const exists = awsProfiles.some(profile => {
    const profileCredentials = awsCredentials[profile];
    return (
      profileCredentials.aws_access_key_id === awsAccessKeyId &&
      profileCredentials.aws_secret_access_key === awsSecretAccessKey
    );
  });

  if (!exists) {
    await createAwsProfile(awsAccessKeyId, awsSecretAccessKey);
  }
};

const promptForProfile = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'search-list',
      name: 'profile',
      message: 'Select AWS profile',
      choices: awsProfiles.map(profile => ({
        name: profile.replace('profile ', ''),
        value: profile,
      })),
    },
  ]);
  return answers.profile;
};

const configureProfile = (profile: string) => {
  awsCredentials.default = {
    ...awsCredentials[profile],
  };

  awsConfig.default = {
    ...awsConfig[`profile ${profile}`],
  };

  writeAwsConfigAndCredentials();

  console.log(`Set profile to: ${profile}`);
};

const writeAwsConfigAndCredentials = () => {
  fs.writeFileSync(
    `${process.env.HOME}/.aws/credentials`,
    ini.stringify(awsCredentials)
  );

  fs.writeFileSync(`${process.env.HOME}/.aws/config`, ini.stringify(awsConfig));
};

const main = async (argProfile: string) => {
  readAwsConfigAndCredentials();
  await checkDefaultProfile();
  if (argProfile) {
    configureProfile(argProfile);
  } else {
    const profile = await promptForProfile();
    configureProfile(profile);
  }
};

main(process.argv[2]);