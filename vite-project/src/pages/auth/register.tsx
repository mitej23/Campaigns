import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import usePostQuery from "@/hooks/usePostQuery";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 400,
    },
  },
};

const Register = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const { mutate, isPending, isError, error } = usePostQuery(
    "/api/users/register"
  );

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onhandleRegsiter = () => {
    mutate(
      { ...userDetails },
      {
        onSuccess: (data) => {
          login(data, searchParams.get("redirect") || undefined);
        },
      }
    );
  };

  const onhandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  // const onhandleGoogle = () => {};

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className={cn("w-[380px]")}>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              placeholder="Your Name"
              value={userDetails["name"]}
              onChange={onhandleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              placeholder="Your Email"
              value={userDetails["email"]}
              onChange={onhandleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <p className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </p> */}
            </div>
            <Input
              name="password"
              type="password"
              required
              value={userDetails["password"]}
              onChange={onhandleInputChange}
            />
          </div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className="mt-5">
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              onClick={onhandleRegsiter}>
              {isPending ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Register"
              )}
            </Button>
          </motion.div>
          {isError && (
            <p className="text-red-400 text-sm font-semibold">
              * {error?.message}
            </p>
          )}
          {/* <div className="flex items-center">
            <Separator className={cn("flex-1")} />
            <p className="px-4 text-slate-400">or</p>
            <Separator className={cn("flex-1")} />
          </div>
          <Button onClick={onhandleGoogle} variant="outline" className="w-full">
            Continue with Google
          </Button> */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to={"/login"} className="underline">
              Login In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
