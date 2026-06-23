import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Layout, Zap, Shield, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Layout,
      title: 'Kanban Boards',
      description: 'Visualize your workflow with drag-and-drop Kanban boards.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members and assign tasks with role-based permissions.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay in sync with live updates and notifications.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with JWT authentication.',
    },
    {
      icon: BarChart3,
      title: 'Activity Tracking',
      description: 'Track every change with detailed activity logs.',
    },
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with priorities and due dates.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="font-semibold text-slate-800">CodeAlpha</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-800 px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
            Project Management
            <br />
            <span className="text-blue-600">Made Simple</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Streamline your workflow, collaborate with your team, and deliver projects on time with CodeAlpha's intuitive project management platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start for Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need</h2>
            <p className="mt-4 text-slate-600">Powerful features to help your team succeed</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ready to get started?</h2>
          <p className="mt-4 text-slate-600 mb-8">
            Join thousands of teams using CodeAlpha to manage their projects.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          CodeAlpha Project Management Tool
        </div>
      </footer>
    </div>
  );
}
