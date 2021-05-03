import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
export default class Add extends SfdxCommand {
    static description: string;
    static examples: string[];
    protected static requiresProject: boolean;
    protected static flagsConfig: {
        name: flags.Discriminated<flags.Array<string>>;
        profile: flags.Discriminated<flags.Array<string>>;
        enabled: flags.Discriminated<flags.Boolean<boolean>>;
        filepath: flags.Discriminated<flags.Boolean<boolean>>;
        username: flags.Discriminated<flags.Option<string>>;
    };
    private sourcePaths;
    run(): Promise<AnyJson>;
}
