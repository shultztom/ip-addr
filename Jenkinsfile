#!groovy

node('master'){
    @Library('nexus-npm-shared-lib')_
    
    def node = tool name: 'Node12.18.3', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${node}/bin:${env.PATH}"
    def npmGlobalPath = sh(script: 'npm bin -g', returnStdout: true).trim()
    env.PATH = "${npmGlobalPath}/bin:${env.PATH}"
    def NAME = ''
        
    stage('Clean') {
        sh "rm -rf"
    }

    stage('Install/Update Yarn') {
        sh "npm i -g yarn"
    }

    stage('Checkout') {
        echo 'Pulling Branch: ' + env.BRANCH_NAME
        checkout scm
    }

    stage('Set Name') {
        // Handles scope
        NAME = sh returnStdout: true, script: ''' node -p "require('./package.json').name.split('/')[1] || require('./package.json').name" '''
        NAME = NAME.trim();
    }

    stage('Install'){
        sh "yarn install"
    }

    if(env.BRANCH_NAME == 'master'){
        stage('Publish'){
            auth.writeNpmrc()
            sh "npm publish"
            auth.cleanNpmrc()
        }

        stage('Docker Login'){
            withCredentials([usernamePassword(credentialsId: 'docker', usernameVariable: 'USERNAME', passwordVariable: 'USERPASS')]) {
                sh "docker login nexus-docker.shultzlab.com -u $USERNAME -p $USERPASS"
                sh "docker login nexus-docker-internal.shultzlab.com -u $USERNAME -p $USERPASS"
            }
        }

        stage('Docker Build And Push'){
            sh "docker build -t nexus-docker-internal.shultzlab.com/shultztom/${NAME}:latest ."
            sh "docker push nexus-docker-internal.shultzlab.com/shultztom/${NAME}:latest"
        }

        stage('Docker Deploy'){
            withCredentials([usernamePassword(credentialsId: 'portainer-userpass', usernameVariable: 'USERNAME', passwordVariable: 'USERPASS')]) {
                def remote = [:]
                remote.name = '10.0.0.35'
                remote.host = '10.0.0.35'
                remote.user = USERNAME
                remote.password = USERPASS
                remote.allowAnyHosts = true

                try{
                    sshCommand remote: remote, command: "docker stop `docker ps | grep nexus-docker.shultzlab.com/shultztom/${NAME}:latest | awk '{print \$1}'`"
                }catch(err){
                    echo 'Issue stopping container'
                }
                
                sshCommand remote: remote, command: "docker pull nexus-docker.shultzlab.com/shultztom/${NAME}:latest"
                sshCommand remote: remote, command: "docker run --rm -d --name ${NAME} -p 10.0.0.35:3000:3000/tcp nexus-docker.shultzlab.com/shultztom/${NAME}:latest"
            }
        }
    }

    stage('Clean') {
        sh "rm -rf"
    }
    
}
