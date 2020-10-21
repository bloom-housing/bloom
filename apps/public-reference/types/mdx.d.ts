declare module "@mdx-js/react" {
  type MDXProps = {
    children: React.ReactNode
    components: { wrapper: React.ReactNode }
  }
  export class MDXProvider extends React.Component<MDXProps> {}
}

declare module "*.mdx" {
  let MDXComponent: (props) => JSX.Element
  export default MDXComponent
}
