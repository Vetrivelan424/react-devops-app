import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle, GitBranch, Server, Package } from 'lucide-react'
import './App.css'

function App() {
  const [deploymentStatus, setDeploymentStatus] = useState('Ready')

  const handleDeploy = () => {
    setDeploymentStatus('Deploying...')
    setTimeout(() => {
      setDeploymentStatus('Deployed Successfully!')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            React DevOps Pipeline Demo
          </h1>
          <p className="text-xl text-gray-600">
            Deployed with Terraform, Jenkins, Docker, and AWS EC2
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Infrastructure
              </CardTitle>
              <CardDescription>
                AWS resources managed by Terraform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>EC2 Instances</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>VPC & Security Groups</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Load Balancer</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                CI/CD Pipeline
              </CardTitle>
              <CardDescription>
                Automated deployment with Jenkins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>GitHub Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Docker Build</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automated Testing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Deployment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant={deploymentStatus === 'Deployed Successfully!' ? 'default' : 'secondary'}>
                  {deploymentStatus}
                </Badge>
                <span className="text-sm text-gray-600">
                  Last deployed: {new Date().toLocaleString()}
                </span>
              </div>
              <Button onClick={handleDeploy} disabled={deploymentStatus === 'Deploying...'}>
                {deploymentStatus === 'Deploying...' ? 'Deploying...' : 'Deploy Now'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-gray-500">
          <p>Built with React, Vite, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}

export default App
