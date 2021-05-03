import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
export default class Add extends SfdxCommand {
    static description: string;
    static examples: string[];
    protected static flagsConfig: {
        name: flags.Discriminated<flags.Array<string>>;
        profile: flags.Discriminated<flags.Array<string>>;
        permissions: flags.Discriminated<flags.Option<string>>;
        filepath: flags.Discriminated<flags.Boolean<boolean>>;
        username: flags.Discriminated<flags.Boolean<boolean>>;
    };
    protected static requiresProject: boolean;
    private sourcePaths;
    run(): Promise<AnyJson>;
}
