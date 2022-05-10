import execa from 'execa'

async function execPulumi(pulumiArgs: string[]) {
    console.log(`> pulumi ${pulumiArgs.join(' ')}`)
    await execa('pulumi', pulumiArgs, {
        stdio: [process.stdin, process.stdout, process.stderr],
    })
}

