import { readProjectConfiguration, Tree } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import generator from './generator'
import { NodeGeneratorSchema } from './schema'

describe('node generator', () => {
    let appTree: Tree
    const options: NodeGeneratorSchema = { name: 'test' }

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace()
    })

    it('should run successfully', async () => {
        await generator(appTree, options)
        const config = readProjectConfiguration(appTree, 'test')
        expect(config).toBeDefined()
    })
})
