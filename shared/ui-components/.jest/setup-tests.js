import registerRequireContextHook from "babel-plugin-require-context-hook/register";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

registerRequireContextHook();

configure({ adapter: new Adapter() });
