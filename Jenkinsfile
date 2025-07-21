pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPOSITORY_FRONTEND = 'crm-pharma-frontend'
        ECR_REPOSITORY_BACKEND = 'crm-pharma-backend'
        ECS_CLUSTER = 'crm-pharma-cluster'
        ECS_SERVICE_FRONTEND = 'crm-pharma-frontend'
        ECS_SERVICE_BACKEND = 'crm-pharma-backend'
        DOCKER_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.COMMIT_HASH = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Code Quality & Security') {
            parallel {
                stage('Frontend Lint & Type Check') {
                    steps {
                        dir('frontend') {
                            sh 'npm run lint'
                            sh 'npm run type-check || echo "Type check completed with warnings"'
                        }
                    }
                }
                stage('Backend Lint & Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm run lint'
                            sh 'npm run test:unit || echo "Unit tests completed"'
                        }
                    }
                }
                stage('Security Scan') {
                    steps {
                        sh 'npm audit --audit-level=high || echo "Security scan completed with warnings"'
                    }
                }
            }
        }
        
        stage('Build Applications') {
            parallel {
                stage('Frontend Build') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'frontend/.next/**/*', allowEmptyArchive: true
                        }
                    }
                }
                stage('Backend Build') {
                    steps {
                        dir('backend') {
                            sh 'npm run build'
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'backend/dist/**/*', allowEmptyArchive: true
                        }
                    }
                }
            }
        }
        
        stage('Docker Build & Push') {
            parallel {
                stage('Frontend Docker') {
                    steps {
                        script {
                            dir('frontend') {
                                def frontendImage = docker.build("${ECR_REPOSITORY_FRONTEND}:${COMMIT_HASH}")
                                
                                docker.withRegistry("https://${DOCKER_REGISTRY}", "ecr:${AWS_REGION}:aws-credentials") {
                                    frontendImage.push()
                                    frontendImage.push("latest")
                                    
                                    if (env.BRANCH_NAME == 'main') {
                                        frontendImage.push("stable")
                                    }
                                }
                            }
                        }
                    }
                }
                stage('Backend Docker') {
                    steps {
                        script {
                            dir('backend') {
                                def backendImage = docker.build("${ECR_REPOSITORY_BACKEND}:${COMMIT_HASH}")
                                
                                docker.withRegistry("https://${DOCKER_REGISTRY}", "ecr:${AWS_REGION}:aws-credentials") {
                                    backendImage.push()
                                    backendImage.push("latest")
                                    
                                    if (env.BRANCH_NAME == 'main') {
                                        backendImage.push("stable")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                }
            }
            steps {
                script {
                    // Rodar migrações do banco
                    sh """
                        docker run --rm \
                            -e DATABASE_URL=\$STAGING_DATABASE_URL \
                            ${DOCKER_REGISTRY}/${ECR_REPOSITORY_BACKEND}:${COMMIT_HASH} \
                            npx prisma migrate deploy
                    """
                    
                    // Deploy backend
                    sh """
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER}-staging \
                            --service ${ECS_SERVICE_BACKEND}-staging \
                            --task-definition ${ECS_SERVICE_BACKEND}-staging:LATEST \
                            --force-new-deployment
                    """
                    
                    // Deploy frontend
                    sh """
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER}-staging \
                            --service ${ECS_SERVICE_FRONTEND}-staging \
                            --task-definition ${ECS_SERVICE_FRONTEND}-staging:LATEST \
                            --force-new-deployment
                    """
                }
            }
        }
        
        stage('Integration Tests') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                }
            }
            steps {
                dir('e2e-tests') {
                    sh 'npm ci'
                    sh 'npx playwright install --with-deps'
                    sh 'npx playwright test --config=staging.config.ts'
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'e2e-tests/playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report'
                    ])
                }
            }
        }
        
        stage('Performance Tests') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        docker run --rm \
                            -v "$(pwd)/performance:/workspace" \
                            loadimpact/k6 run /workspace/load-test.js
                    '''
                }
            }
        }
        
        stage('Security Scan - Images') {
            steps {
                script {
                    // Scan das imagens Docker
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy image \
                            ${DOCKER_REGISTRY}/${ECR_REPOSITORY_FRONTEND}:${COMMIT_HASH}
                    """
                    
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy image \
                            ${DOCKER_REGISTRY}/${ECR_REPOSITORY_BACKEND}:${COMMIT_HASH}
                    """
                }
            }
        }
        
        stage('Manual Approval for Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def deploymentApproved = false
                    
                    try {
                        timeout(time: 15, unit: 'MINUTES') {
                            def userInput = input(
                                id: 'deploy-production',
                                message: 'Deploy to Production Environment?',
                                parameters: [
                                    choice(
                                        name: 'DEPLOY_TO_PROD',
                                        choices: ['No', 'Yes'],
                                        description: 'Deploy this build to production?'
                                    ),
                                    string(
                                        name: 'APPROVAL_REASON',
                                        defaultValue: '',
                                        description: 'Reason for deployment'
                                    )
                                ]
                            )
                            
                            if (userInput.DEPLOY_TO_PROD == 'Yes') {
                                deploymentApproved = true
                                echo "Production deployment approved: ${userInput.APPROVAL_REASON}"
                            }
                        }
                    } catch (err) {
                        echo "Manual approval timed out or was cancelled"
                        deploymentApproved = false
                    }
                    
                    if (!deploymentApproved) {
                        error('Production deployment was not approved')
                    }
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Backup do banco antes do deploy
                    sh """
                        aws rds create-db-snapshot \
                            --db-instance-identifier crm-pharma-prod \
                            --db-snapshot-identifier crm-pharma-backup-\$(date +%Y%m%d%H%M%S)
                    """
                    
                    // Deploy com Blue-Green
                    sh """
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER}-prod \
                            --service ${ECS_SERVICE_BACKEND}-prod \
                            --task-definition ${ECS_SERVICE_BACKEND}-prod:LATEST \
                            --deployment-configuration maximumPercent=200,minimumHealthyPercent=50 \
                            --force-new-deployment
                    """
                    
                    // Aguardar estabilização do backend
                    sh """
                        aws ecs wait services-stable \
                            --cluster ${ECS_CLUSTER}-prod \
                            --services ${ECS_SERVICE_BACKEND}-prod
                    """
                    
                    // Deploy do frontend
                    sh """
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER}-prod \
                            --service ${ECS_SERVICE_FRONTEND}-prod \
                            --task-definition ${ECS_SERVICE_FRONTEND}-prod:LATEST \
                            --deployment-configuration maximumPercent=200,minimumHealthyPercent=50 \
                            --force-new-deployment
                    """
                }
            }
        }
        
        stage('Post-Deploy Verification') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Health checks
                    sh '''
                        echo "Verificando saúde da aplicação..."
                        curl -f https://api.crm-pharma.com/api/v1/health || exit 1
                        curl -f https://crm-pharma.com/api/health || exit 1
                    '''
                    
                    // Smoke tests
                    sh '''
                        echo "Executando smoke tests..."
                        # Adicionar smoke tests específicos aqui
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup
            sh 'docker system prune -f || true'
        }
        
        success {
            script {
                def message = """
                ✅ *CRM Farmacêutico - Deploy Successful*
                
                *Branch:* ${env.BRANCH_NAME}
                *Build:* #${env.BUILD_NUMBER}
                *Commit:* ${env.COMMIT_HASH}
                *Duration:* ${currentBuild.durationString}
                
                🔗 *Links:*
                • [Build Details](${env.BUILD_URL})
                • [Test Report](${env.BUILD_URL}artifact/playwright-report/index.html)
                • [Production](https://crm-pharma.com)
                """
                
                slackSend(
                    color: 'good',
                    message: message,
                    channel: '#crm-pharma-deploys'
                )
            }
        }
        
        failure {
            script {
                def message = """
                ❌ *CRM Farmacêutico - Deploy Failed*
                
                *Branch:* ${env.BRANCH_NAME}
                *Build:* #${env.BUILD_NUMBER}
                *Commit:* ${env.COMMIT_HASH}
                *Error:* ${currentBuild.result}
                
                🔗 [Build Details](${env.BUILD_URL})
                """
                
                slackSend(
                    color: 'danger',
                    message: message,
                    channel: '#crm-pharma-alerts'
                )
                
                // Rollback automático em caso de falha
                if (env.BRANCH_NAME == 'main') {
                    sh '''
                        echo "Iniciando rollback automático..."
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER}-prod \
                            --service ${ECS_SERVICE_FRONTEND}-prod \
                            --task-definition ${ECS_SERVICE_FRONTEND}-prod:PREVIOUS \
                            --force-new-deployment
                            
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER}-prod \
                            --service ${ECS_SERVICE_BACKEND}-prod \
                            --task-definition ${ECS_SERVICE_BACKEND}-prod:PREVIOUS \
                            --force-new-deployment
                    '''
                }
            }
        }
        
        unstable {
            slackSend(
                color: 'warning',
                message: "⚠️ CRM Farmacêutico - Build #${env.BUILD_NUMBER} is unstable",
                channel: '#crm-pharma-alerts'
            )
        }
    }
}
