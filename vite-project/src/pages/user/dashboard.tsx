import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { logout } = useAuth();
  // console.log(user);

  return (
    <div>
      <p>Dashboard check</p>
      <Button onClick={() => logout()} variant="outline">
        logout
      </Button>
    </div>
  );
};

export default Dashboard;
