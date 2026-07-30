import { useState } from "react";

const [helper, sethelper] = useState({
    name: '',
    description: "",
    image: null,
    images: [],
    hotels: [
        {
            title: '',
            price: '',
            images: []
        }
    ]

})

export default function Helper() {



    // ------------------
    //  Only for strings 
    // ------------------
    const handleChanges = (e) => {
        const { name, value } = e.target
        sethelper({
            ...helper,
            [name]: value
        })
    }
    // ------------------



    // ------------------
    //  Only for One Image 
    // ------------------
    const handleImageChange = (e) => {
        const file = e.target.files[0]

        sethelper({
            ...helper,
            image: file
        })
    }


    // ------------------


    // ------------------
    //  Only for Multiple Images 
    // ------------------
    const handlemultipleImageChange = (e) => {
        const files = Array.from(e.target.files)

        sethelper({
            ...helper,
            images: [...helper.images, ...files]
        })
    }
    // ------------------

    return (
        <form>
            <input
                type="text"
                name="name"
                value={helper.name}
                onChange={handleChanges}
            />
            <input
                type="text"
                name="description"
                value={helper.description}
                onChange={handleChanges}
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            {helper.image && (
                <img
                    src={URL.createObjectURL(helper.image)}
                    className="w-40 h-40 object-cover"
                />
            )}

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlemultipleImageChange}
            />

            {helper.images.map((image, index) => (
                <img
                    key={index}
                    src={c}
                    alt="image"
                />
            ))}

        </form>
    )
}

export default function NestedArrays() {


    const handleHotelChange = (e, index) => {
        const { name, value } = e.target

        const updateHotels = [...helper.hotels]

        updateHotels[index][name] = value

        sethelper({
            ...helper,
            hotels: updateHotels
        })

    }

    const handleHotelImages = (e, index) => {
        const files = Array.from(e.target.files)

        const updateHotel = [...helper.hotels]

        updateHotel[index].images = [
            ...updateHotel[index].images,
            ...files
        ]

        sethelper({
            ...helper,
            hotels: updateHotel
        })
    }


    return (
        <form action="">
            {helper.hotels.map((hotel, index) => (
                <div>
                    <input
                        type="text"
                        name="title"
                        value={hotel.title}
                        onChange={(e) => handleHotelChange(e, index)}
                    />
                    <input
                        type="number"
                        name="price"
                        value={hotel.price}
                        onChange={(e) => handleHotelChange(e, index)}
                    />

                    <input
                        type="file"
                        multiple
                        onChange={(e) => handleHotelImages(e, index)}
                    />
                    {hotel.images.map((image, index) => (
                        <img src={URL.createObjectURL(image)} alt="" />
                    ))}










                    




                    <input
                        type="text"
                        name="name"
                        value={helper.hotels.title}
                        onChange={(e) => handelChangesInHotel(e, index)}
                        id=""
                    />







                </div>

            ))}

        </form>
    )
}

const handelChangesInHotel = (e, index) =>{
    const {name, value} = e.target

    const updateInChanges = [ ...helper.hotels]

    updateInChanges[index][name] = value

    sethelper({
        ...helper,
        hotels: updateInChanges
    })

}


const handleCoverImage = (e) => {
    const file = e.target.files[0]

    sethelper({
        ...helper,
        image: file
    })
}


