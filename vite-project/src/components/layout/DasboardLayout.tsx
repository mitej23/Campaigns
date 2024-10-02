import Sidebar from "./Sidebar";

const DasboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <Sidebar />
      <div className="p-12 ml-[220px]">{children}</div>
    </div>
  );
};

export default DasboardLayout;
