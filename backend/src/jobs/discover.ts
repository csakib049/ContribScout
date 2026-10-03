import { pool } from "../db/pool";
import { discoverCandidates } from "../services/discovery";
import { syncRepo } from "./sync";




export async function runDiscovery(){
    console.log(`Starting repository discovery...`);
    const approved = await discoverCandidates();
    console.log(`Discovery found ${approved.length} approved candidates.`);


    for(const candidate of approved){
        try{
            await syncRepo(candidate.fullName,'discovered');
        }catch(err){
           console.error(`Failed to sync discovered repo ${candidate.fullName}:`,err)
        }
    }

    console.log('Discovery complete.')
}


if(require.main === module){
    runDiscovery().finally(()=>pool.end()); // closes the database connection after discovery finishes
}