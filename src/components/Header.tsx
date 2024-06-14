import { GiMoebiusTriangle } from "react-icons/gi";

const Header = () => {
  return (
    <div className="text-white border-b border-white/15 py-4 w-11/12 mx-auto mb-20">
      <nav className="font-MontserratSemiBold flex justify-start items-center nav">
        <GiMoebiusTriangle className="text-3xl hover:text-green-400 transition cursor-pointer" />
      </nav>
    </div>
  );
};
export default Header;
