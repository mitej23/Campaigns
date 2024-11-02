import Sidebar from "./Sidebar";

const DasboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <Sidebar />
      <div className="flex flex-col min-h-screen p-12 ml-[220px]">
        {children}
      </div>
    </div>
  );
};

export default DasboardLayout;
