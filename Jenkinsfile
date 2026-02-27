pipeline {
    agent any
    
    tools {
        jdk 'jdk17'
        maven 'maven'
        nodejs 'node20'
    }
    
    environment {
        FRONTEND_DIR = "frontend"
        BACKEND_DIR = "backend"
        DEPLOY_PATH = "/var/www/html"
    }

    stages {

        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh "rm -rf ${DEPLOY_PATH}/*"
                sh "cp -r ${FRONTEND_DIR}/dist/* ${DEPLOY_PATH}/"
            }
        }

        stage('Restart Nginx') {
            steps {
                sh 'systemctl restart nginx'
            }
        }
    }
}
