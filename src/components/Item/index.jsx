import Link from "../Link"

const Item = ({ link, text }) => {
    return (
        <span>
            <Link link={link} text={text} />
        </span>
    )
}

export default Item