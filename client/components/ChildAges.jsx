import Form from 'react-bootstrap/Form';


function ChildAges (props) {
    const { childIndex } = props;
    const { setChildAge } = props;

    return (
            <Form.Select onChange={(e) => setChildAge(e, childIndex)} size="sm" >
                <option value="" disabled selected>Child {childIndex + 1} age</option>
                <option value = "0">&lt;1 year old</option>
                <option value = "2">2 years old</option>
                <option value = "3">3 years old</option>
                <option value = "4">4 years old</option>
                <option value = "5">5 years old</option>
                <option value = "6">6 years old</option>
                <option value = "7">7 years old</option>
                <option value = "8">8 years old</option>
                <option value = "9">9 years old</option>
                <option value = "10">10 years old</option>
                <option value = "11">11 years old</option>
                <option value = "12">12 years old</option>
                <option value = "13">13 years old</option>
                <option value = "14">14 years old</option>
                <option value = "15">15 years old</option>
                <option value = "16">16 years old</option>
                <option value = "17">17 years old</option>
            </Form.Select>
    )
}

export default ChildAges