import Link from 'next/link'
 

export default function Page() {
  return (<div>
            <h1>Hello, Next.js!</h1>
            
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
