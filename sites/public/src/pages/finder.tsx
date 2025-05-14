import RentalsFinder from "../components/finder/RentalsFinder";
import Layout from "../layouts/application";
import MaxWidthLayout from "../layouts/max-width";
import { PageHeaderSection } from "../patterns/PageHeaderLayout";

export default function Finder() {
  return (
    <Layout>
      <RentalsFinder />
    </Layout>
  )
}