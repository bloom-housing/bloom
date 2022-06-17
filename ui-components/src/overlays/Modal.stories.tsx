import React, { useState } from "react"
import "./Modal.scss"
import { Modal } from "./Modal"
import { Button } from "../actions/Button"
import { AppearanceBorderType, AppearanceStyleType } from "../global/AppearanceTypes"

export default {
  title: "Overlays/Modal",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const noop = () => {
  // intentionally blank
}

export const BasicModal = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setOpenModal(!openModal)
        }}
      >
        Open Modal
      </Button>
      <div style={{ height: "1000px" }}></div>
      <div>…</div>
      <Modal
        open={openModal}
        title="Modal Title"
        ariaDescription="Modal description"
        onClose={() => setOpenModal(!openModal)}
        actions={[
          <Button onClick={() => setOpenModal(!openModal)} styleType={AppearanceStyleType.primary}>
            Submit
          </Button>,
          <Button
            onClick={() => setOpenModal(!openModal)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
          >
            Cancel
          </Button>,
        ]}
      >
        Modal Content
      </Modal>
    </>
  )
}

export const ScrollableModal = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setOpenModal(!openModal)
        }}
      >
        Open Modal
      </Button>
      <div style={{ height: "1000px" }}></div>
      <div>…</div>
      <Modal
        open={openModal}
        title="Modal Title"
        ariaDescription="Modal description"
        onClose={() => setOpenModal(!openModal)}
        actions={[
          <Button onClick={() => setOpenModal(!openModal)} styleType={AppearanceStyleType.primary}>
            Submit
          </Button>,
          <Button
            onClick={() => setOpenModal(!openModal)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
          >
            Cancel
          </Button>,
        ]}
        scrollable
      >
        <div>
          <h1>Modal Content</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Leo a diam sollicitudin tempor id eu.
            Porttitor lacus luctus accumsan tortor. Viverra mauris in aliquam sem fringilla. At
            augue eget arcu dictum. Penatibus et magnis dis parturient montes nascetur ridiculus mus
            mauris. Velit euismod in pellentesque massa placerat duis ultricies lacus sed. Aliquam
            vestibulum morbi blandit cursus risus. Tellus at urna condimentum mattis pellentesque id
            nibh. Interdum consectetur libero id faucibus. Platea dictumst vestibulum rhoncus est
            pellentesque elit ullamcorper. Tristique senectus et netus et malesuada. Ultrices neque
            ornare aenean euismod elementum. Tellus elementum sagittis vitae et leo duis. In egestas
            erat imperdiet sed euismod nisi porta. Nisl purus in mollis nunc sed id semper risus. Ac
            turpis egestas sed tempus urna et pharetra pharetra. Nibh mauris cursus mattis molestie
            a iaculis at erat pellentesque. Ultricies mi eget mauris pharetra et ultrices. Enim
            facilisis gravida neque convallis a cras semper auctor. Risus pretium quam vulputate
            dignissim suspendisse in est ante. Cursus vitae congue mauris rhoncus aenean vel. In
            vitae turpis massa sed elementum tempus egestas sed. Blandit libero volutpat sed cras
            ornare arcu. Sapien faucibus et molestie ac. Duis ut diam quam nulla. Non nisi est sit
            amet facilisis magna. Maecenas ultricies mi eget mauris pharetra. Risus nec feugiat in
            fermentum posuere urna nec tincidunt praesent. Enim diam vulputate ut pharetra sit amet
            aliquam id diam. Ultricies mi quis hendrerit dolor. In aliquam sem fringilla ut morbi
            tincidunt. Leo a diam sollicitudin tempor id eu nisl. Rhoncus urna neque viverra justo.
            Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Nisi
            scelerisque eu ultrices vitae auctor. Consequat mauris nunc congue nisi. Id diam vel
            quam elementum pulvinar etiam. Cras ornare arcu dui vivamus. Eu turpis egestas pretium
            aenean pharetra. Lobortis feugiat vivamus at augue eget arcu dictum varius. Massa enim
            nec dui nunc. Montes nascetur ridiculus mus mauris vitae ultricies leo integer. Arcu
            risus quis varius quam quisque id diam. Et magnis dis parturient montes nascetur
            ridiculus mus. Sed adipiscing diam donec adipiscing tristique risus nec feugiat in.
            Porttitor rhoncus dolor purus non enim praesent. Arcu non sodales neque sodales ut.
            Aenean et tortor at risus viverra. Aliquet sagittis id consectetur purus. Suscipit
            tellus mauris a diam maecenas. Pharetra sit amet aliquam id diam maecenas ultricies mi.
            Tellus id interdum velit laoreet. Arcu cursus vitae congue mauris. Sem integer vitae
            justo eget magna fermentum iaculis eu. Morbi tristique senectus et netus et malesuada
            fames. Bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim. Sed felis
            eget velit aliquet. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent.
            Vitae sapien pellentesque habitant morbi tristique senectus et netus et. Sit amet mattis
            vulputate enim nulla aliquet porttitor. Amet dictum sit amet justo donec. Mauris augue
            neque gravida in. Sed vulputate mi sit amet mauris commodo quis imperdiet massa.
            Faucibus turpis in eu mi bibendum neque egestas congue. At ultrices mi tempus imperdiet
            nulla. Et leo duis ut diam quam nulla porttitor massa id. Natoque penatibus et magnis
            dis parturient montes nascetur. Nunc vel risus commodo viverra maecenas. Enim lobortis
            scelerisque fermentum dui faucibus in ornare quam viverra. Est ante in nibh mauris
            cursus mattis molestie a iaculis. Habitant morbi tristique senectus et netus. Integer
            feugiat scelerisque varius morbi enim nunc. Venenatis lectus magna fringilla urna. Nunc
            vel risus commodo viverra maecenas accumsan. Quam lacus suspendisse faucibus interdum
            posuere. Velit euismod in pellentesque massa placerat duis ultricies. In metus vulputate
            eu scelerisque felis imperdiet proin. Convallis convallis tellus id interdum velit
            laoreet id. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Eget
            nunc scelerisque viverra mauris. In nisl nisi scelerisque eu ultrices. Pretium vulputate
            sapien nec sagittis aliquam malesuada bibendum arcu. Eget est lorem ipsum dolor sit amet
            consectetur. Auctor urna nunc id cursus metus aliquam. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames. Etiam erat velit scelerisque in dictum.
            Sodales neque sodales ut etiam sit amet nisl purus. Interdum consectetur libero id
            faucibus nisl tincidunt eget nullam. Sed turpis tincidunt id aliquet. Duis at
            consectetur lorem donec massa. Egestas congue quisque egestas diam in. A erat nam at
            lectus urna duis. Rhoncus dolor purus non enim praesent elementum. At imperdiet dui
            accumsan sit amet nulla. Leo urna molestie at elementum eu facilisis sed odio. Molestie
            nunc non blandit massa enim. Egestas egestas fringilla phasellus faucibus scelerisque
            eleifend donec pretium vulputate. Mollis nunc sed id semper risus in hendrerit gravida.
            Nam libero justo laoreet sit amet cursus. Id neque aliquam vestibulum morbi blandit.
          </p>
        </div>
      </Modal>
    </>
  )
}

export const TransparentOverlayModal = () => (
  <Modal
    open={true}
    title="Modal Title"
    ariaDescription="Modal description"
    hideCloseIcon
    actions={[
      <Button onClick={noop} styleType={AppearanceStyleType.primary}>
        Submit
      </Button>,
      <Button
        onClick={noop}
        styleType={AppearanceStyleType.secondary}
        border={AppearanceBorderType.borderless}
      >
        Cancel
      </Button>,
    ]}
    backdrop={false}
  >
    Modal Content
  </Modal>
)

export const SuccessFailureModal = () => (
  <Modal
    open={true}
    title="Modal Title"
    ariaDescription="Modal description"
    onClose={noop}
    actions={[
      <Button onClick={noop} styleType={AppearanceStyleType.success}>
        Submit
      </Button>,
      <Button onClick={noop} styleType={AppearanceStyleType.alert}>
        Cancel
      </Button>,
    ]}
  >
    Modal Content
  </Modal>
)
