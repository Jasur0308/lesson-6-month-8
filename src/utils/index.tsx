// const Container = ({children} : {children : JSX.Element}) => {
const Container = ({children} : {children : React.ReactNode}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export { Container }