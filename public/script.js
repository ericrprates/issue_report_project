$(document).ready(() => {
  $.ajax({
    url: "http://localhost:3002/issues",
    method: "get",
    success: result => {
      let ul = "<ul>";
      let li = "<li>";
      let cli = "</li>";
      let cul = "</ul>";
      let element = result.map(
        issue =>
          `<li class="title">${issue.title} - ${issue.description} - ${
            issue.createdAt
          }${ul}${issue.files
            .map(
              file =>
                `${li}<a href="${file.url}" title="Foto registrada">${file.name}</a>${cli}`
            )
            .join("")}${cul}${cli}`
      );
      $("#body").html(element);
    },
    error: err => {}
  });
});
