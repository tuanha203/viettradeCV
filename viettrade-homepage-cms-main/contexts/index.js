import PropTypes from "prop-types";
import { ReactQueryProvider } from "./ReactQuery";

export function AppProviders({ children, pageProps }) {
  return (
    <ReactQueryProvider pageProps={pageProps}>{children}</ReactQueryProvider>
  );
}
AppProviders.propTypes = {
  children: PropTypes.any,
  pageProps: PropTypes.any,
};
