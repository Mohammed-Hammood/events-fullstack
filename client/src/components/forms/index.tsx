import LogoutForm from "./logout-form";
import AddEditEvent from "./add-edit-event-form";
import { FormsNames, ModalTypes } from 'types';
import SearchForm from "./search-form";
// import LoginForm from "./accounts/authentication-login";
// import DeleteUserForm from "./accounts/delete-user";
// import SearchForm from "./common/search-form";
// import PaginationForm from "./common/pagination-form";
// import AccountImageEditForm from "./accounts/image-edit";
// import PasswordResetForm from "./accounts/password-reset";
// import AddEditArticleForm from './articles/add-edit-article';
// import SocialShareForm from "./common/social-share-form";
// import PostDeleteForm from "./posts/delete-post";
// import AddEditPostForm from "./posts/add-edit-post";
// import PostsFiltersForm from "./posts/posts-filters";
// import ImageSelector from "./common/image-selector";

type FormsTypes = {
    [key in FormsNames]: JSX.Element
}

interface Props {
    modal: ModalTypes
    setModal: (modal: ModalTypes) => void;
    props: any
}

export default function Forms(props: Props): JSX.Element | null {
    const { form } = props.modal;
    const forms: FormsTypes = {
        "logout": <LogoutForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        "search": <SearchForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        "add-edit-event": <AddEditEvent {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "search": <SearchForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "image-selector": <ImageSelector {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "goals-analytics": <GoalsAnalyticsForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "add-edit-article": <AddEditArticleForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "password-reset": <PasswordResetForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "pagination": <PaginationForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "social-share": <SocialShareForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "login": <LoginForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "delete-account": <DeleteUserForm  {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "profile-edit": <ProfileSettingsForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "account-image-edit": <AccountImageEditForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "add-edit-post": <AddEditPostForm {...props.props} setModal={props.setModal} modal={props.modal} />,
        // "post-delete": <PostDeleteForm {...props.props} setModal={props.setModal} modal={props.modal} />,
    }
    if (forms && forms.hasOwnProperty(form)) return forms[form];
    return null;
}