import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
export default class Edit extends SfdxCommand {
    static description: string;
    static examples: string[];
    protected static flagsConfig: {
        name: flags.Discriminated<flags.Option<string>>;
        rename: flags.Discriminated<flags.Option<string>>;
        profile: flags.Discriminated<flags.Array<string>>;
        enabled: flags.Discriminated<flags.Boolean<boolean>>;
        filepath: flags.Discriminated<flags.Boolean<boolean>>;
        username: flags.Discriminated<flags.Boolean<boolean>>;
    };
    protected static requiresProject: boolean;
    private sourcePaths;
    run(): Promise<AnyJson>;
}
