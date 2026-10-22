import { GitHub as GithubIcon } from "react-feather";
import { Icon as ReactIcon } from "./ReactIcon";

export const Logo = () => {
  return (
    <div className="Logo">
      Ogma + <ReactIcon width={18} height={18} className="ReactIcon" /> React
      <a
        href="https://github.com/linkurious/ogma-react"
        target="_blank"
        className="gh-link"
      >
        <div title="Go to code">
          <GithubIcon />
        </div>
      </a>
    </div>
  );
};
