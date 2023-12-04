import { Button, Spacer, Link } from "@geist-ui/core";
import { Github as GithubIcon } from "@geist-ui/icons";
import { Icon as ReactIcon } from "./ReactIcon";

export const Logo = () => {
  return (
    <div className="Logo">
      Ogma + <ReactIcon /> React <Spacer inline />
      <Link href="https://github.com/linkurious/ogma-react">
        <Button
          icon={<GithubIcon />}
          w="28px"
          h="28px"
          px={0.5}
          title="Go to code"
          auto
        />
      </Link>
    </div>
  );
};
