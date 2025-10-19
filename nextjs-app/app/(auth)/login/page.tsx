import AuthForm from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Sign in',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
