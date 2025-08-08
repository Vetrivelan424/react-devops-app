pipeline {
    agent any

    environment {
        AWS_REGION       = "us-east-1" // Change to your region
        AWS_ACCOUNT_ID   = "782636843432" // Change to your AWS account ID
        ECR_REPO         = "react-devops-app" // Your ECR repo name
        DOCKER_TAG       = "${BUILD_NUMBER}"
        DOCKER_REGISTRY  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        APP_SERVER_IP    = "${APP_SERVER_IP}" // Set from Jenkins configuration
        SSH_KEY          = credentials('ec2-ssh-key') // Jenkins credential ID for SSH key
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
        // write SSH key content to file
        writeFile file: 'deploy_key.pem', text: "${SSH_KEY}"
        sh 'chmod 600 deploy_key.pem'

        sh """
            ssh -i deploy_key.pem -o StrictHostKeyChecking=no ubuntu@${APP_SERVER_IP} \\
            "docker stop react-app || true && \
             docker rm react-app || true && \
             docker pull $DOCKER_REGISTRY/$ECR_REPO:latest && \
             docker run -d --name react-app -p 80:80 $DOCKER_REGISTRY/$ECR_REPO:latest"
        """

        // optionally delete the key file after deploy
        sh 'rm -f deploy_key.pem'
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
