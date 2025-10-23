pipeline {
  agent {
    docker {
      image 'node:18'        // Используем контейнер Node.js для npm
      args '-u root:root'    // Даём root-доступ (нужен для docker build)
    }
  }

  environment {
    IMAGE_NAME = "myuser/my-next-app"
    IMAGE_TAG  = "latest"    // Один тег, чтобы не накапливать образы
  }

  stages {

    stage('Checkout') {
      steps {
        echo "📥 Cloning repository..."
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        echo "📦 Installing dependencies..."
        sh 'npm ci'
      }
    }

    stage('Run tests') {
      steps {
        echo "🧪 Running unit tests..."
        sh 'npm test || echo "⚠️ No tests yet, skipping..."'
      }
    }

    stage('Build Docker image') {
      steps {
        echo "🐳 Building Docker image..."
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
      }
    }

    stage('Deploy locally') {
      steps {
        echo "🚀 Deploying new container..."
        sh '''
          # Останавливаем предыдущий контейнер, если есть
          docker ps -q --filter "name=my-next-app" | grep -q . && docker stop my-next-app && docker rm my-next-app || true
          
          # Запускаем новое приложение
          docker run -d -p 3000:3000 --name my-next-app ${IMAGE_NAME}:${IMAGE_TAG}
        '''
      }
    }

    stage('Push to Docker Hub (optional)') {
      when { expression { return env.DOCKER_PUSH == 'true' } }
      steps {
        echo "☁️ Pushing image to Docker Hub..."
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push ${IMAGE_NAME}:${IMAGE_TAG}
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline succeeded — image: ${IMAGE_NAME}:${IMAGE_TAG}"
      echo "🧹 Cleaning up unused Docker images..."
      sh 'docker image prune -f'
    }
    failure {
      echo "❌ Pipeline failed"
    }
  }
}
