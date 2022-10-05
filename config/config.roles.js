// Built in roles

ROLE = [
    {
        name: "system", 
        permission: "system",
        descrption: "Unlimited access, With great power comes great responsibility"
    }, 
    {
        name: "user",
        permission: ["profile_read","profile_update"],
        descrption: "Basic user on the system, whom can login and manage their own profile only, require by ALL users to access their profile"
    },
    {
        name: "user_admin",
        permission: ["user_create","user_read","user_update","user_delete"],
        descrption: "Can administrate all 'non-system' users in the system",
    },
    {
        name: "read_only",
        permission: ["profile_read", "user_read", "item_read", "file_read", "bug_read"],
        descrption: "Custom role to only read: users, files and items"
    },
    {
        name: "file_admin",
        permission: [ "file_create","file_read","file_update", "file_delete" ],
        descrption: "Can administrate file uploads"
    },
    {
        name: "item_admin",
        permission: [ "item_create","item_read","item_update", "item_delete" ],
        descrption: "Can administrate store items"
    },
    {
        name: "bug_admin",
        permission: [ "bug_create","bug_read","bug_update", "bug_delete"],
        descrption: "Can administrate bugs"
    }
    
    
]

module.exports = {
    ROLE
}