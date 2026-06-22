export default function Page() {
  return (<div>
            <style>{` p { color: red; } `}</style>
            <h1>This is the search page!</h1>
            <Profile/>
            
          </div>
  );
  
}
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
} 
