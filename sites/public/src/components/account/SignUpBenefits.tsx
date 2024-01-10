import { Icon, HeadingGroup } from "@bloom-housing/ui-seeds"
import { faStopwatch, faEye, faLock } from "@fortawesome/free-solid-svg-icons"
const SignUpBenefits = () => {
  const iconListItems = [
    { icon: faStopwatch, text: "Apply faster with saved application details" },
    { icon: faEye, text: "Check on the status of an application at any time" },
    { icon: faLock, text: "Simply reset your password if you forget it" },
  ]
  return (
    <div className="w-min mt-6 ml-6">
      <HeadingGroup
        heading={"Sign up quickly and check application status at anytime"}
        subheading={
          "Having an account will save you time by using saved application details, and allow you to check the status of an application at anytime."
        }
        size="xl"
      />
      <ul className="flex flex-col">
        {iconListItems.map((item) => (
          <li className="flex flex-row w-max mb-2 items-center">
            <Icon
              icon={item.icon}
              size="lg"
              className="border border-white bg-white rounded-full p-1.5 w-max"
              key={item.text}
            />
            <p className="ml-2">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SignUpBenefits
