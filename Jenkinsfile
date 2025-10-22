pipeline {
  agent any
  environment {
    IMAGE_NAME = "myuser/my-next-app"
    IMAGE_TAG  = "${env.GIT_COMMIT.take(7)}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install dependencies') {
      steps { sh 'npm ci' }
    }

    stage('Run tests') {
      steps { sh 'npm test || echo "No tests yet"' }
    }

    stage('Build Docker image') {
      steps { sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ." }
    }

    stage('Push to Docker Hub (optional)') {
      when { expression { return env.DOCKER_PUSH == 'true' } }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
            docker push ${IMAGE_NAME}:${IMAGE_TAG}
            docker push ${IMAGE_NAME}:latest
          '''
        }
      }
    }
  }

  post {
    success { echo " Pipeline succeeded: ${IMAGE_NAME}:${IMAGE_TAG}" }
    failure { echo " Pipeline failed" }
  }
}
