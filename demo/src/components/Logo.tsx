import { Space, ActionIcon } from "@mantine/core";
import { GitHub as GithubIcon } from "react-feather";
import { Icon as ReactIcon } from "./ReactIcon";

export const Logo = () => {
  return (
    <div className="Logo">
      Ogma + <ReactIcon width={18} height={18} className="ReactIcon" /> React
      <Space w="md" />
      <a href="https://github.com/linkurious/ogma-react" target="_blank">
        <ActionIcon
          variant="outline"
          w="28px"
          h="28px"
          px={0.5}
          title="Go to code"
        >
          <GithubIcon />
        </ActionIcon>
      </a>
    </div>
  );
};
