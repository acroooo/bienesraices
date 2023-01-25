const myProperties = (req, res) => {
    res.render(
        'properties/admin-panel', {
            title: 'Mis propiedades',
            navigation: true,
        }
    )
}

export {
    myProperties
}