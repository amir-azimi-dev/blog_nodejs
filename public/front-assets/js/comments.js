const allReplyElems = document.querySelectorAll(".reply");
const postSlug = document.getElementById("slug").innerHTML;

allReplyElems.forEach(replyElem => {
    replyElem.firstElementChild.addEventListener("click", e => replyHandler(e));
});

function replyHandler(event) {
    event.preventDefault();

    const activeReplyForms = document.querySelectorAll(".active-reply-form");
    activeReplyForms.forEach(replyForm => {
        replyForm.remove();
    });

    const articleElem = event.target.parentElement.parentElement;
    console.log(articleElem.id);
    const formTemplate = getReplyFormTemplate(articleElem.id);
    const targetArticleElem = document.getElementById(articleElem.id);
    targetArticleElem.insertAdjacentHTML("beforeend", formTemplate);
};

function getReplyFormTemplate(parentId) {
    return `\
<div class="active-reply-form row py-4">
    <h4 class='mb-4 text-muted'>پاسخ</h4>
    <div class="col-12 mx-auto">
        <form role="form" class="comment-form" action="/p/${postSlug}/comments" method="post">
            <div class="row d-none">
                <div class=" col-md-12">
                    <div class="form-group ">
                        <input name="parent" type="text" class="form-control d-none" value='${parentId}'>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class=" col-md-12">
                    <div class="form-group ">
                        <input name="user_url" type="text" class="form-control" placeholder="وب سایت">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="controls">
                    <textarea name="user_comment" id="message" rows="5" placeholder="نظر*" class="form-control"
                        required=""></textarea>
                </div>
            </div>
            <p class="text-muted">برای ثبت نظر اگر وارد نشده‌اید باید وارد شوید.</p>
            <p class="text-muted">فیلدهای مورد نیاز علامت گذاری شده اند *</p>
            <div class="text-center mt-md-5">
                <button type="submit" class="btn btn-theme">ارسال</button>
            </div>
        </form>
    </div>
</div>`;
};