node {
  def app
  disableConcurrentBuilds()
  currentBuild.result = "SUCCESS"
  try {
    stage('Clone repository') {
      checkout scm
    }
    
    stage('NPM Install') {
      sh 'pwd'
      sh 'node -v'
      sh 'rm -rf node_modules'
      sh 'npm cache clean --force'
      sh 'npm install'
    }
    
    stage('NPM Build') {
      sh 'npm run build'
      sh 'npm run coverage'
    }
    
    stage('Build Docker Image') {
      app = docker.build("dot1q/dwdm-manager-backend")
    }

    stage('Test image') {
        app.inside {
            sh 'echo "Tests passed"'
        }
    }
    
    stage('Push image') {
        docker.withRegistry('https://fake-jenkins.com', 'credId') {
            if (env.BRANCH_NAME != 'main') {
                echo 'This is not master'
                app.push("latest-dev")
            } else {
                app.push("latest-prod")
            }
            
        }
    }
  } catch (err) {
    currentBuild.result = 'FAILURE'
    throw err
  } finally {
    step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: "${sn_dev_email_dist_list}", sendToIndividuals: true])
  }
}
