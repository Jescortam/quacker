dateSchema.virtual('creationString').get(function () {
    return `${this.creation.toLocaleDateString()}, 
            ${this.creation.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
})