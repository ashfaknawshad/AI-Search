import AuthForm from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Sign up',
  description: 'Create a new account',
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
