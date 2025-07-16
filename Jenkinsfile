@Library('linkurious-shared')_

nodeJob {
  projectName = "linkurious/ogma-react"
  podTemplateNames = ['jnlp-agent-node']
  parameterList = [
    string(name: 'run', defaultValue: '', description: 'Run Id'),
    string(name: 'test:e2e', defaultValue: 'ayv1ac1b32he', description: '')
  ]
  runPreReleaseOnUpload = false
  npmPackPath = './dist'
  createGitTag = true
  gitTagPrefix = 'v'
  runNpmPublish = true
  runDependencyVersionCheck = false
  runBookeeping = true
  githubRelease = true
}
