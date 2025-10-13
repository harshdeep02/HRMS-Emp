
const isPathMatch = (basePath, currentPath) => {
    if (!basePath) {
        return false;
    }
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
};

export const getBreadcrumbs = (menuItems, currentPath) => {
    let breadcrumbs = [];
    // console.log('menuItems', menuItems)
    for (const item of menuItems) {
        // Check top-level items first, like "Files" or "Reports"
        if (!item.submenu) {
            if (isPathMatch(item.path, currentPath)) {
                breadcrumbs.push({ label: item.label, path: item.path });
                return breadcrumbs;
            }
            // Handle detail/add/edit pages for non-submenu items like Performance
            const isDetailMatch = isPathMatch(item.detail, currentPath);
            const isAddMatch = isPathMatch(item.add, currentPath);
            const isEditMatch = isPathMatch(item.edit, currentPath);

            if (isDetailMatch || isAddMatch || isEditMatch) {
                // Push the top-level page as a clickable breadcrumb
                breadcrumbs.push({ label: item.label, path: item.path });

                // Add the secondary breadcrumb based on the action
                if (isDetailMatch) {
                    breadcrumbs.push({ label: `${item.label} Details` });
                } else if (isAddMatch) {
                    breadcrumbs.push({ label: `Add New ${item.label}` });
                } else if (isEditMatch) {
                    breadcrumbs.push({ label: `Edit ${item.label}` });
                }
                return breadcrumbs;
            }
        }
        
        if (item.submenu) {
            for (const sub of item.submenu) {
                // ✅ Check path for detail, add, edit
                const isDetailMatch =
                    isPathMatch(sub.detail, currentPath);
                const isAddMatch =
                    isPathMatch(sub.add, currentPath);
                const isEditMatch =
                    isPathMatch(sub.edit, currentPath);
                const isEditList =
                    isPathMatch(sub.list, currentPath);

                if (isDetailMatch || isAddMatch || isEditMatch) {
                    // Push clickable list page

                    {
                        sub.main &&
                        breadcrumbs.push({
                            label: sub.main,
                            path: sub.main
                        })
                    }

                    breadcrumbs.push({
                        label: sub.BreadL,
                        path: sub.path
                    });

                    // Push second item
                    if (isDetailMatch) {
                        breadcrumbs.push({ label: `${sub?.BreadD || sub.label } Details` });
                    } else if (isAddMatch) {
                        breadcrumbs.push({ label: sub.BreadA });
                    } else if (isEditList) {
                        breadcrumbs.push({ label: `${sub.label}` });
                    } else if (isEditMatch) {
                        breadcrumbs.push({ label: `Edit ${sub?.BreadE || sub.label}` });
                    }
                    return breadcrumbs;
                }
                if (isEditList) {
                    // Push clickable list page
                    breadcrumbs.push({
                        label: sub.main,
                        path: sub.path
                    });

                    // Push second item
                    if (isEditList) {
                        breadcrumbs.push({ label: `${sub.label}` });
                    }
                    return breadcrumbs;
                }
            }
        }
    }

    return [];
};
