pipeline {
    agent any

    environment {
        AWS_REGION       = "us-east-1" // Change to your region
        AWS_ACCOUNT_ID   = "782636843432" // Change to your AWS account ID
        ECR_REPO         = "react-devops-app" // Your ECR repo name
        DOCKER_TAG       = "${BUILD_NUMBER}"
        DOCKER_REGISTRY  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        APP_SERVER_IP    = "${APP_SERVER_IP}" // Set from Jenkins configuration
        SSH_PRIVATE_KEY  = credentials('SSH_KEY_ACCESS') // Jenkins credential ID for SSH key
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                npm install pnpm
                pnpm install --no-frozen-lockfile
                '''
            }
        }

        // stage('Run Tests') {
        //    steps {
        //       sh 'pnpm run test --watchAll=false'
        //    }
        //   }

        stage('Build Application') {
            steps {
                sh 'pnpm run build'
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    sh '''
                        aws ecr get-login-password --region $AWS_REGION \
                        | docker login --username AWS --password-stdin $DOCKER_REGISTRY
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $DOCKER_REGISTRY/$ECR_REPO:$DOCKER_TAG .
                    docker tag $DOCKER_REGISTRY/$ECR_REPO:$DOCKER_TAG $DOCKER_REGISTRY/$ECR_REPO:latest
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    docker push $DOCKER_REGISTRY/$ECR_REPO:$DOCKER_TAG
                    docker push $DOCKER_REGISTRY/$ECR_REPO:latest
                '''
            }
        }

  stage('Deploy to EC2') {
  steps {
    sshagent(['SSH_KEY_ACCESS']) {  // use your credential ID here
      sh """
        ssh -o StrictHostKeyChecking=no ubuntu@${APP_SERVER_IP} \\
          "docker stop react-devops-app || true && \
           docker rm react-devops-app || true && \
           docker pull $DOCKER_REGISTRY/$ECR_REPO:latest && \
           docker run -d --name react-devops-app -p 80:80 $DOCKER_REGISTRY/$ECR_REPO:latest"
      """
    }
  }
}

    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
