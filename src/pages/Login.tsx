
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const { login, signUp, verifyCode, isLoading, isVerifying } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sign-up state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState({ firstName: "", lastName: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      // Verification screen will be shown
    }
  };

  const validateName = (name: string, field: 'firstName' | 'lastName'): boolean => {
    const letterOnlyRegex = /^[A-Za-z\s]+$/;
    
    if (!letterOnlyRegex.test(name)) {
      setNameError(prev => ({
        ...prev,
        [field]: "Name should contain only letters"
      }));
      return false;
    }
    
    setNameError(prev => ({
      ...prev,
      [field]: ""
    }));
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate first name and last name
    const isFirstNameValid = validateName(firstName, 'firstName');
    const isLastNameValid = validateName(lastName, 'lastName');
    
    if (!isFirstNameValid || !isLastNameValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Names should contain only letters."
      });
      return;
    }
    
    if (signUpPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match."
      });
      return;
    }
    
    const success = await signUp(firstName, lastName, signUpEmail, signUpPassword);
    if (success) {
      toast({
        title: "Account created",
        description: "Please verify your email to continue."
      });
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyCode(verificationCode);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orphan-gray">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orphan-blue">Orphanage Management System</h1>
          <p className="text-muted-foreground mt-2">Secure access to children's records and orphanage operations</p>
        </div>
        
        <Card className="animate-fade-in shadow-lg">
          {isVerifying ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-orphan-blue">
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription className="text-center">
                  Please enter the verification code sent to your email/phone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium">
                      Verification Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For demo purposes, use code: 123456
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-orphan-blue hover:bg-orphan-lightBlue"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-orphan-blue">
                  Welcome
                </CardTitle>
                <CardDescription className="text-center">
                  Login or sign up to access the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            placeholder="staff@orphanage.org"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label htmlFor="password" className="text-sm font-medium">
                            Password
                          </label>
                          <a href="#" className="text-xs text-orphan-blue hover:underline">
                            Forgot password?
                          </a>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          For demo purposes, use admin@orphanage.org / password123
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-orphan-blue hover:bg-orphan-lightBlue"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Input
                              id="firstName"
                              type="text"
                              placeholder="John"
                              value={firstName}
                              onChange={(e) => {
                                setFirstName(e.target.value);
                                validateName(e.target.value, 'firstName');
                              }}
                              className={`pl-10 ${nameError.firstName ? 'border-red-500' : ''}`}
                              required
                            />
                          </div>
                          {nameError.firstName && (
                            <p className="text-xs text-red-500">{nameError.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                              validateName(e.target.value, 'lastName');
                            }}
                            className={nameError.lastName ? 'border-red-500' : ''}
                            required
                          />
                          {nameError.lastName && (
                            <p className="text-xs text-red-500">{nameError.lastName}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="signUpEmail" className="text-sm font-medium">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input
                            id="signUpEmail"
                            type="email"
                            placeholder="your.email@example.com"
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="signUpPassword" className="text-sm font-medium">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input
                            id="signUpPassword"
                            type="password"
                            placeholder="••••••••"
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm Password
                        </label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={signUpPassword !== confirmPassword && confirmPassword ? 'border-red-500' : ''}
                          required
                        />
                        {signUpPassword !== confirmPassword && confirmPassword && (
                          <p className="text-xs text-red-500">Passwords don't match</p>
                        )}
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-orphan-blue hover:bg-orphan-lightBlue"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Sign Up"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          )}
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Protected by advanced encryption and two-factor authentication
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
