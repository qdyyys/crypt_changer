import { GiMoebiusTriangle } from "react-icons/gi";

const Header = () => {
  return (
    <div className="text-white border-b border-white/15 py-4 w-11/12 mx-auto mb-20">
      <nav className="font-MontserratSemiBold flex justify-around items-center">
        <GiMoebiusTriangle className="text-3xl hover:text-green-400 transition cursor-pointer" />
        <ul className="flex gap-10">
          <li className="cursor-pointer hover:text-green-400 transition">
            О нас
          </li>
          <li className="cursor-pointer hover:text-green-400 transition">
            Блог
          </li>
          <li className="cursor-pointer hover:text-green-400 transition">
            FAQ
          </li>
          <li className="cursor-pointer hover:text-green-400 transition">
            Поддержка
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Header;
